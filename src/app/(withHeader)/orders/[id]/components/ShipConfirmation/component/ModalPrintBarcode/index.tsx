/* eslint-disable jsx-a11y/alt-text */
import { BarCode } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import { Document, PDFViewer, Page, View, StyleSheet, Text, Svg, Rect, G } from '@react-pdf/renderer';


export function SVGToComponent(html: string) {
  if (!html || html === "") return null;

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(html, 'text/xml');
  const svgItems = xmlDoc.querySelectorAll('svg > *');

  const itemStrings: any = [];

  svgItems.forEach((item) => {
    const itemString = item.outerHTML;
    itemStrings.push(itemString);
  });

  const svgNode: any = xmlDoc.documentElement;
  const { width, height, viewbox } = svgNode.attributes;

  return (
    <>
      <Svg width={width.value} height={height.value} viewBox={viewbox.value}>
        {itemStrings.map((item: any, index: number) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(item, 'text/xml');
          const rootNode: any = xmlDoc.documentElement;
          const tagName = rootNode.tagName.toLowerCase();
          if (tagName === 'rect') {
            const { x, y, width, height, style } = rootNode.attributes;
            return <Rect key={index} x={x.value} y={y.value} width={width.value} height={height.value} fill={style.value.split(':')[1].slice(0, -1)} />;
          } else if (tagName === 'g') {
            const { transform, style } = rootNode.attributes;
            const fill = style.value.split(':')[1].slice(0, -1);
            const children = Array.from(rootNode.children).map((child: any, childIndex) => {
              const childTagName = child.tagName ? child.tagName.toLowerCase() : null;
              if (childTagName === 'rect') {
                const { x, y, width, height } = child.attributes;
                return <Rect key={childIndex} x={x.value} y={y.value} width={width.value} height={height.value} />;
              }
              if (childTagName === 'text') {
                const { style, 'text-anchor': textAnchor, x, y } = child.attributes;
                const fontSize = parseInt(style.value.split(' ')[1]);
                return <Text key={childIndex} style={{ fontSize }} textAnchor={textAnchor.value} x={x.value} y={y.value}>{child.textContent}</Text>;
              }
              return null;
            });
            return <G key={index} transform={transform.value} fill={fill}>{children}</G>;
          }
          return null;
        })}
      </Svg>
    </>
  )
}

const PrintModalBarcode = ({
  open,
  onClose,
  barcodeData,
}: {
  open: boolean;
  onClose: () => void;
  barcodeData: BarCode[] | undefined;
}) => {

  return (
    <Modal open={open} onClose={onClose} title="Barcode">
      {barcodeData && !!barcodeData?.length && (
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
            {barcodeData.map((item: any) =>
              Array(item.quantity)
                .fill(item)
                .map((ele: BarCode, index) => {
                  return (
                    <Page key={index} size="A6" style={styles.page}>
                      <View style={styles.container}>
                        {SVGToComponent(`${ele?.upc}`)}
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
