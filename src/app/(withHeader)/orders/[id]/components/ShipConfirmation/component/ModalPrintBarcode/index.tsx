/* eslint-disable jsx-a11y/alt-text */
import { BarCode } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import { Document, PDFViewer, Page, View, StyleSheet, Text, Svg, Rect, ClipPath, Defs, G, Path, Tspan } from '@react-pdf/renderer';
import { JSDOM } from 'jsdom'

const a = `<svg width="242px" height="142px" x="0px" y="0px" viewbox="0 0 242 142"
xmlns="http://www.w3.org/2000/svg" version="1.1" style="transform: translate(0,0)">
<rect x="0" y="0" width="242" height="142" style="fill:#ffffff;"></rect>
<g transform="translate(10, 10)" style="fill:#000000;">
  <text style="font: 20px monospace" text-anchor="start" x="0" y="122">1</text>
</g>
<g transform="translate(26, 10)" style="fill:#000000;">
  <rect x="0" y="0" width="2" height="112"></rect>
  <rect x="4" y="0" width="2" height="112"></rect>
  <rect x="10" y="0" width="4" height="112"></rect>
  <rect x="18" y="0" width="2" height="112"></rect>
  <text style="font: 20px monospace" text-anchor="middle" x="10" y="134"></text>
</g>
<g transform="translate(46, 10)" style="fill:#000000;">
  <rect x="4" y="0" width="2" height="100"></rect>
  <rect x="10" y="0" width="4" height="100"></rect>
  <rect x="18" y="0" width="4" height="100"></rect>
  <rect x="26" y="0" width="2" height="100"></rect>
  <rect x="32" y="0" width="2" height="100"></rect>
  <rect x="38" y="0" width="4" height="100"></rect>
  <rect x="46" y="0" width="4" height="100"></rect>
  <rect x="54" y="0" width="2" height="100"></rect>
  <rect x="60" y="0" width="2" height="100"></rect>
  <rect x="66" y="0" width="4" height="100"></rect>
  <text style="font: 20px monospace" text-anchor="middle" x="35" y="122">21212</text>
</g>
<g transform="translate(116, 10)" style="fill:#000000;">
  <rect x="2" y="0" width="2" height="112"></rect>
  <rect x="6" y="0" width="2" height="112"></rect>
  <text style="font: 20px monospace" text-anchor="middle" x="5" y="134"></text>
</g>
<g transform="translate(126, 10)" style="fill:#000000;">
  <rect x="0" y="0" width="4" height="100"></rect>
  <rect x="8" y="0" width="4" height="100"></rect>
  <rect x="14" y="0" width="4" height="100"></rect>
  <rect x="20" y="0" width="4" height="100"></rect>
  <rect x="28" y="0" width="4" height="100"></rect>
  <rect x="36" y="0" width="4" height="100"></rect>
  <rect x="42" y="0" width="4" height="100"></rect>
  <rect x="48" y="0" width="4" height="100"></rect>
  <rect x="56" y="0" width="4" height="100"></rect>
  <rect x="64" y="0" width="4" height="100"></rect>
  <text style="font: 20px monospace" text-anchor="middle" x="35" y="122">12121</text>
</g>
<g transform="translate(196, 10)" style="fill:#000000;">
  <rect x="0" y="0" width="4" height="112"></rect>
  <rect x="6" y="0" width="4" height="112"></rect>
  <rect x="14" y="0" width="2" height="112"></rect>
  <rect x="18" y="0" width="2" height="112"></rect>
  <text style="font: 20px monospace" text-anchor="middle" x="10" y="134"></text>
</g>
<g transform="translate(216, 10)" style="fill:#000000;">
  <text style="font: 20px monospace" text-anchor="end" x="15" y="122">2</text>
</g>
</svg>`

// import {JSDOM} from 'jsdom'
// import { Text, Svg, Rect, G, ClipPath, Defs, Path, Tspan } from '@react-pdf/renderer';

type ComponentType = React.ElementType

// https://dev.to/qausim/convert-html-inline-styles-to-a-style-object-for-react-components-2cbi
const formatStringToCamelCase = (str: string) => {
  const splitted = str.split("-");
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
};

export const getStyleObjectFromString = (str: string | null) => {
  const style: any = {};
  if (!str) return {};

  str.split(";").forEach((el) => {
    const [property, value] = el.split(":");
    if (!property) return;
    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  return style;
};

function parseIntAttributes(attr: string | null) {
  if (!attr) return null;
  if (attr.includes('px')) return attr;

  return Number(attr);
}


export function SVGToComponent(html: string) {
  if (!html || html === "") return null;

  console.log('html', html)

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(html, 'text/xml');

  const svgNode: any = xmlDoc.documentElement;
  const childNodes = svgNode.childNodes;
  const { width, height, viewbox } = svgNode.attributes;

  const childElements = Array.from(childNodes).map((node: any) => new XMLSerializer().serializeToString(node)).filter((node) => node !== '\n');
  // const svgElement: any = (new DOMParser()).parseFromString(html, 'image/svg+xml').documentElement;
  // const { width, height, viewBox } = svgElement.attributes;

  // console.log('childElements', childElements.map((item) => console.log('item', item)))

  return (
    // <></>
    <Svg width={width.value} height={height.value} viewBox={viewbox.value}>
      {childElements.map((item, index) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(item, 'text/xml');
        const rootNode: any = xmlDoc.documentElement;
        const tagName = rootNode.tagName.toLowerCase();

        console.log('tagName', tagName)
    
        if (tagName === 'rect') {
          const { x, y, width, height, style } = rootNode.attributes;
          console.log('width', width)
          return <Rect key={index} x={x.value} y={y.value} width={width.value} height={height.value} fill={style.value.split(':')[1].slice(0, -1)} />;
        } else if (tagName === 'g') {
          const { transform, style } = rootNode.attributes;
          console.log('transform', transform)
          const fill = style.value.split(':')[1].slice(0, -1);
          const children = Array.from(rootNode.children).map((child: any, childIndex) => {
            const childTagName = child.tagName ? child.tagName.toLowerCase() : null;
            console.log('childTagName', childTagName)
            if (childTagName === 'rect') {
              const { x, y, width, height } = child.attributes;
              return <Rect key={childIndex} x={x.value} y={y.value} width={width.value} height={height.value} />;
            } 
             if (childTagName === 'text') {
              const { style, 'text-anchor': textAnchor, x, y } = child.attributes;
              const fontSize = parseInt(style.value.split(' ')[1]);
              return <Text key={childIndex} style={{ fontSize }} textAnchor={textAnchor} x={x.value} y={y.value}>{child.textContent}</Text>;
            }
            return null;
          });
          return <G key={index} transform={transform.value} fill={fill}>{children}</G>;
        }
        return null;
        // if (index === 0) {
        //   return <Rect x="0" y="0" width="242" height="142" fill="#ffffff"></Rect>
        // }
        // if (index === 1) {
        //   return (
        //     <G>
        //       <Text style={{ fontSize: 10 }} text-anchor="start" x="0" y="122">1</Text>
        //     </G>
        //   )
        // }
        // if (index === 2) {
        //   return (
        //     <G transform="translate(26, 10)" fill="#000000">
        //       <Rect x="0" y="0" width="2" height="112"></Rect>
        //       <Rect x="4" y="0" width="2" height="112"></Rect>
        //       <Rect x="10" y="0" width="4" height="112"></Rect>
        //       <Rect x="18" y="0" width="2" height="112"></Rect>
        //       <Text style={{ fontSize: 10 }} text-anchor="middle" x="10" y="134"></Text>
        //     </G>
        //   )
        // }
        // return null
      })}
    </Svg>
  )



  // const svgElement: any = (new DOMParser()).parseFromString(html, 'image/svg+xml').documentElement;

  // svgElement.children.map((item: any) => console.log('item', item))

  // const jsDom = new JSDOM(html);

  // console.log('jsDom', jsDom)

  // function renderNode(node: Element) {
  //   let Component: ComponentType;
  //   let componentProps = {};
  //   switch (node.tagName.toUpperCase()) {
  //     case "SVG":
  //       Component = Svg
  //       componentProps = {
  //         height: parseIntAttributes(node.getAttribute('height')),
  //         width: parseIntAttributes(node.getAttribute('width')),
  //         viewBox: node.getAttribute('viewBox'),
  //         style: {
  //           fontSize: '12px'
  //         }
  //       }
  //       break;
  //     case "RECT":
  //       Component = Rect
  //       componentProps = {
  //         x: parseIntAttributes(node.getAttribute('x')),
  //         y: parseIntAttributes(node.getAttribute('y')),
  //         fill: node.getAttribute('fill'),
  //         width: parseIntAttributes(node.getAttribute('width')),
  //         height: parseIntAttributes(node.getAttribute('height')),
  //         rx: parseIntAttributes(node.getAttribute('rx')),
  //         ry: parseIntAttributes(node.getAttribute('ry'))
  //       }
  //       break
  //     case "CLIPPATH":
  //       Component = ClipPath
  //       break;
  //     case "DEFS":
  //       Component = Defs
  //       break;
  //     case "G":
  //       Component = G
  //       componentProps = {
  //         'data-z-index': node.getAttribute('data-z-index'),
  //         opacity: node.getAttribute('opacity'),
  //         transform: node.getAttribute('transform'),
  //         'clip-path': node.getAttribute('clip-path'),
  //         visibility: node.getAttribute('visibility')
  //       }
  //       break;
  //     case "TEXT":
  //       Component = Text
  //       componentProps = {
  //         x: parseIntAttributes(node.getAttribute('x')),
  //         'text-anchor': node.getAttribute('text-anchor'),
  //         'data-z-index': node.getAttribute('data-z-index'),
  //         style: getStyleObjectFromString(node.getAttribute('style')),
  //         y: parseIntAttributes(node.getAttribute('y'))
  //       }
  //       break;
  //     case "PATH":
  //       Component = Path
  //       componentProps = {
  //         'data-z-index': node.getAttribute('data-z-index'),
  //         d: node.getAttribute('d'),
  //         fill: node.getAttribute('fill'),
  //         opacity: node.getAttribute('opacity')
  //       }
  //       break;
  //     case "TSPAN":
  //       componentProps = {
  //         x: parseIntAttributes(node.getAttribute("x")),
  //         y: parseIntAttributes(node.getAttribute("y")),
  //         fill: node.getAttribute("fill"),
  //         stroke: node.getAttribute("stroke"),
  //         "stroke-width": node.getAttribute("stroke-width"),
  //         "stroke-linejoin": node.getAttribute("stroke-linejoin"),
  //         opacity: parseIntAttributes(node.getAttribute('opacity')),
  //         visibility: node.getAttribute('visibility'),
  //         fontWeight: node.getAttribute('fontWeight')
  //       }
  //       Component = Tspan
  //       break;
  //     case "DESC":
  //       return null;
  //     default:
  //       throw new Error(`unsupported type ${node.tagName}`)
  //   }

  //   if (node.children) {
  //     return (
  //       <Component {...componentProps}>
  //         {Array.from(node.children).map(renderNode)}
  //       </Component>
  //     )
  //   }
  //   return (
  //     <Component {...componentProps} />
  //   )
  // }

  // console.log('jsDomjsDom', jsDom)

  return <></>
  // return renderNode(jsDom.window.document.body.children[0])
}

const ExampleSvg = ({ bardcodeSvg }: any) => {
  if (!bardcodeSvg) {
    return <></>
  }
  console.log('bardcodeSvg', bardcodeSvg)
  const ConvertedSvg = `${bardcodeSvg}`
    .replace(/<svg/g, '<Svg')
    .replace(/<\/svg>/g, '</Svg>')
    .replace(/<rect/g, '<Rect')
    .replace(/<\/rect>/g, '</Rect>')
    .replace(/<g/g, '<G')
    .replace(/<\/g>/g, '</G>')
    .replace(/<text/g, '<Text')
    .replace(/<\/text>/g, '</Text>')
    .replace(/viewbox/g, 'viewBox')
    .replace(/style="fill:#([0-9a-fA-F]{6});"/g, 'fill="#$1"');


  if (ConvertedSvg) {
    console.log('ConvertedSvg', !!ConvertedSvg, ConvertedSvg)
    const svgElement: any = (new DOMParser()).parseFromString(ConvertedSvg, 'image/svg+xml').documentElement;
    // const SvgElement: any = (new DOMParser()).parseFromString(ConvertedSvg, 'image/svg+xml').documentElement;
    const { width, height, viewBox } = svgElement.attributes;
    console.log('widthwidth', typeof svgElement.children, svgElement)
    // const { width, height, viewBox } = svgElement.attributes;
    // console.log('width', typeof svgElement, svgElement)
    // const Content: any = (new DOMParser()).parseFromString(svgElement.innerHTML, 'image/svg+xml').documentElement;

    //     const svgString = `
    //   <Svg width="242px" height="142px" x="0px" y="0px" viewBox="0 0 242 142" xmlns="http://www.w3.org/2000/svg" version="1.1" style="transform: translate(0,0)">
    //     <Rect x="0" y="0" width="242" height="142" fill="#ffffff"></Rect>
    //     <G transform="translate(10, 10)">
    //       <Text style="font: 20px monospace" text-anchor="start" x="0" y="122">1</Text>
    //     </G>
    //   </Svg>
    // `;

    //     const cleanSvgString = svgString
    //       .replace(/ x="\d+px"/g, '')
    //       .replace(/ y="\d+px"/g, '')
    //       .replace(/ style=".*?"/g, '');

    //     const svgElement: any = new DOMParser().parseFromString(cleanSvgString, 'image/svg+xml').documentElement;
    return (
      <>
        <Svg width={width.value} height={height.value} viewBox={viewBox.value}>
          {/* {svgElement.children} */}
        </Svg>
      </>
    )
  }

  // const { width, height, viewBox } = svgElement.attributes;

  // console.log('bbbbb', SvgElement)
  return (
    <Svg width="242px" height="142px" viewBox="0 0 242 142">
      {/* {svgElement.innerHTML} */}
    </Svg>
    // SvgElement
    // <ConvertedSvg />
    // <Svg width="242px" height="142px" viewBox="0 0 242 142">
      // <Rect x="0" y="0" width="242" height="142" fill="#ffffff"></Rect>
      // <G transform="translate(10, 10)" fill="#000000">
      //   <Text style={{ fontSize: 10 }} text-anchor="start" x="0" y="122">1</Text>
      // </G>
      // <G transform="translate(26, 10)" fill="#000000">
      //   <Rect x="0" y="0" width="2" height="112"></Rect>
      //   <Rect x="4" y="0" width="2" height="112"></Rect>
      //   <Rect x="10" y="0" width="4" height="112"></Rect>
      //   <Rect x="18" y="0" width="2" height="112"></Rect>
      //   <Text style={{ fontSize: 10 }} text-anchor="middle" x="10" y="134"></Text>
      // </G>
    //   <G transform="translate(46, 10)" fill="#000000">
    //     <Rect x="4" y="0" width="2" height="100"></Rect>
    //     <Rect x="10" y="0" width="4" height="100"></Rect>
    //     <Rect x="18" y="0" width="4" height="100"></Rect>
    //     <Rect x="26" y="0" width="2" height="100"></Rect>
    //     <Rect x="32" y="0" width="2" height="100"></Rect>
    //     <Rect x="38" y="0" width="4" height="100"></Rect>
    //     <Rect x="46" y="0" width="4" height="100"></Rect>
    //     <Rect x="54" y="0" width="2" height="100"></Rect>
    //     <Rect x="60" y="0" width="2" height="100"></Rect>
    //     <Rect x="66" y="0" width="4" height="100"></Rect>
    //     <Text style={{ fontSize: 10 }} text-anchor="middle" x="35" y="122">21212</Text>
    //   </G>
    //   <G transform="translate(116, 10)" fill="#000000">
    //     <Rect x="2" y="0" width="2" height="112"></Rect>
    //     <Rect x="6" y="0" width="2" height="112"></Rect>
    //     <Text style={{ fontSize: 10 }} text-anchor="middle" x="5" y="134"></Text>
    //   </G>
    //   <G transform="translate(126, 10)" fill="#000000">
    //     <Rect x="0" y="0" width="4" height="100"></Rect>
    //     <Rect x="8" y="0" width="4" height="100"></Rect>
    //     <Rect x="14" y="0" width="4" height="100"></Rect>
    //     <Rect x="20" y="0" width="4" height="100"></Rect>
    //     <Rect x="28" y="0" width="4" height="100"></Rect>
    //     <Rect x="36" y="0" width="4" height="100"></Rect>
    //     <Rect x="42" y="0" width="4" height="100"></Rect>
    //     <Rect x="48" y="0" width="4" height="100"></Rect>
    //     <Rect x="56" y="0" width="4" height="100"></Rect>
    //     <Rect x="64" y="0" width="4" height="100"></Rect>
    //     <Text style={{ fontSize: 10 }} text-anchor="middle" x="35" y="122">12121</Text>
    //   </G>
    //   <G transform="translate(196, 10)" fill="#000000">
    //     <Rect x="0" y="0" width="4" height="112"></Rect>
    //     <Rect x="6" y="0" width="4" height="112"></Rect>
    //     <Rect x="14" y="0" width="2" height="112"></Rect>
    //     <Rect x="18" y="0" width="2" height="112"></Rect>
    //     <Text style={{ fontSize: 10 }} text-anchor="middle" x="10" y="134"></Text>
    //   </G>
    //   <G transform="translate(216, 10)" fill="#000000">
    //     <Text style={{ fontSize: 10 }} text-anchor="end" x="15" y="122">2</Text>
    //   </G>
    // </Svg>
  )
};

const PrintModalBarcode = ({
  open,
  onClose,
  barcodeData,
  bardcodeSvg
}: {
  open: boolean;
  onClose: () => void;
  barcodeData: BarCode[] | undefined;
  bardcodeSvg: any
}) => {
  const chart = SVGToComponent(a)

  // const svgElement: any = new DOMParser().parseFromString(cleanSvgString, 'image/svg+xml').documentElement;

  return (
    <Modal open={open} onClose={onClose} title="Barcode">
      {bardcodeSvg && !!bardcodeSvg?.length && (
        <PDFViewer style={{ width: '100%', height: '500px' }}>
          <Document>
          
            {/* {barcodeData.map((item) =>
              Array(item.quantity)
                .fill(item)
                .map((ele: BarCode, index) => (
                  <Page key={index} size="A6" style={styles.page}>
                    <View style={styles.container}>
                      <Image src={ele?.upc} />
                      <Text style={styles.textSku}>{ele?.sku}</Text>
                    </View>
                  </Page>
                ))
            )} */}
            {bardcodeSvg.map((item: any) =>
              Array(item.quantity)
                .fill(item)
                .map((ele: BarCode, index) => {
                  console.log('ele', ele)
                  return (
                    <Page key={index} size="A6" style={styles.page}>
                      <View style={styles.container}>
                        {SVGToComponent(a)}
                        {/* <Image src={ele?.upc} /> */}
                        <Text style={styles.textSku}>{ele?.sku}</Text>
                      </View>
                    </Page>
                  )
                })
            )}
          </Document>
        </PDFViewer>
      )}
    </Modal>
  );
};

export default PrintModalBarcode;

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    color: 'black'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    transform: 'rotate(-90deg)'
  },
  barcodeImage: {
    marginBottom: 10,
    width: 420
  },
  textSku: {
    fontSize: 24
  }
});
