import { Document, Image, PDFViewer, Page, View, StyleSheet, Text } from '@react-pdf/renderer';

import PackingSlip from '../ModalPrintPackingSlip/PackingSlip';
import { BarCode, Order } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import GS1 from '../ModalGS1/Gs1';

const ModalPrintAll = ({
  open,
  onClose,
  orderDetail,
  barcodeData,
  printAllGs1,
  allLabel
}: {
  open: boolean;
  onClose: () => void;
  orderDetail: Order;
  barcodeData: BarCode[] | undefined;
  printAllGs1:
    | {
        forBarcode: string;
        shipToPostBarcode: string;
        ssccBarcode: string[];
      }
    | undefined;
  allLabel: string[];
}) => {
  return (
    <Modal title="Print all" open={open} onClose={onClose}>
      <PDFViewer style={styles.viewer}>
        <Document>
          {allLabel.map((item) => (
            <Page size="A4" style={styles.page} key={item}>
              <Image style={styles.image} src={item} />
            </Page>
          ))}

          <PackingSlip orderDetail={orderDetail} />

          {printAllGs1 &&
            orderDetail.order_packages.map((_, index: number) => (
              <GS1
                key={index}
                orderDetail={orderDetail}
                ssccBarcode={printAllGs1.ssccBarcode[index]}
                shipToPostBarcode={printAllGs1.shipToPostBarcode}
                forBarcode={printAllGs1.forBarcode}
              />
            ))}
          {barcodeData?.map((item) =>
            Array(item.quantity)
              .fill(item)
              .map((ele, index) => (
                <Page key={index} size="A6" style={styles.page}>
                  <View style={styles.container}>
                    <Image src={ele?.upc} style={styles.barcodeImage} />
                    <Text style={styles.text}>{ele?.sku}</Text>
                  </View>
                </Page>
              ))
          )}
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ModalPrintAll;

const styles = StyleSheet.create({
  text: {
    color: 'black'
  },
  page: {
    backgroundColor: '#ffffff',
    color: 'white'
  },
  section: {
    margin: 10,
    padding: 10
  },
  viewer: {
    width: '100%',
    height: 417
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
  image: {
    paddingTop: '10%',
    width: '100%',
    height: '100%'
  },
  textSku: {
    fontSize: 24
  }
});
