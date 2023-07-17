import xml.etree.ElementTree as ET

import xmlschema


class XMLGenerator:
    def __init__(self, schema_file: str, data: dict, mandatory_only=False):
        self.schema = xmlschema.XMLSchema(schema_file)
        self.data = data
        self.mandatory_only = mandatory_only

        self.ET = ET
        self.root = None

    def generate(self) -> str:
        for node in self.schema.root_elements:
            if self.mandatory_only and node.occurs[0] < 1:
                continue
            self.root = ET.Element(node.local_name, xmlns=self.schema.target_namespace)
            self._recur_build(node, self.root, {}, True)

            return ET.tostring(self.root).decode("utf-8")

    def write(self, filename) -> None:
        if self.root is None:
            return

        tree = ET.ElementTree(self.root)
        tree.write(filename, encoding="utf-8", xml_declaration=True)

    def _recur_build(self, xsdnode, xmlnode, index_dict, isroot=False) -> None:
        # skip if only mandatory fields
        if self.mandatory_only and xsdnode.occurs[0] < 1:
            return

        if not isroot:
            xmlnode = ET.SubElement(xmlnode, xsdnode.local_name)

        # simple content
        if xsdnode.type.has_simple_content():
            if xsdnode.annotation is not None:
                xmlnode.text = str(
                    self.get_data(xsdnode.annotation.documentation[0].text, index_dict)
                )

        # complex types
        else:
            content_type = xsdnode.type.model_group
            # choice
            if hasattr(content_type, "model") and content_type.model == "choice":
                selected_node = content_type._group[0]

                # find mandatory element in group
                if self.mandatory_only:
                    for subnode in content_type._group:
                        if subnode.occurs[0] < 1:
                            continue
                        else:
                            selected_node = subnode

                self._recur_build(selected_node, xmlnode, index_dict)
            else:
                # sequence
                for subnode in content_type._group:
                    if not hasattr(subnode, "process_contents"):  # xs:element
                        if hasattr(subnode, "_group"):
                            subnode = subnode._group[0]

                        if subnode.annotation is not None and subnode.max_occurs != 1:
                            path = ".".join(
                                subnode.annotation.documentation[0].text.split(".")[:-1]
                            )

                            for index, item in enumerate(
                                self.get_data(path, index_dict)
                            ):
                                item_index_dict = index_dict
                                item_index_dict[
                                    subnode.annotation.documentation[0].text.split(".")[
                                        -1
                                    ]
                                ] = index
                                self._recur_build(subnode, xmlnode, item_index_dict)
                        else:
                            self._recur_build(subnode, xmlnode, index_dict)
                    else:  # xs:any
                        ET.SubElement(xmlnode, "Any")  # any - close with any tag

        # attributes
        _attributes = dict
        if hasattr(xsdnode, "attributes"):
            _attributes = xsdnode.attributes
        else:
            if hasattr(xsdnode.type, "attributes"):
                _attributes = xsdnode.type.attributes

        for attr, attr_obj in _attributes.items():
            xmlnode.attrib[attr] = str(
                self.get_data(attr_obj.annotation.documentation[0].text, index_dict)
            )

    def get_data(self, path, index_dict):
        data = self.data

        for key in path.split("."):
            if key in index_dict:
                data = data[index_dict[key]]
            else:
                data = data[key]

        return data
