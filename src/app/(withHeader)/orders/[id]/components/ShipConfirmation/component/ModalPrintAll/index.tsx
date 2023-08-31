import { Document, Image, PDFViewer, Page, View, StyleSheet } from '@react-pdf/renderer';
import PackingSlip from '../ModalPrintPackingSlip/PackingSlip';
import { Order } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import GS1 from '../ModalGS1/Gs1';

const ModalPrintAll = ({
  open,
  onClose,
  orderDetail,
  barcodeData,
  printAllGs1
}: {
  open: boolean;
  onClose: () => void;
  orderDetail: Order;
  barcodeData: string[] | undefined;
  printAllGs1:
    | {
        forBarcode: string;
        shipToPostBarcode: string;
        ssccBarcode: string[];
      }
    | undefined;
}) => {
  return (
    <Modal title="Print all" open={open} onClose={onClose}>
      <PDFViewer style={styles.viewer}>
        <Document>
          <PackingSlip orderDetail={orderDetail} />

          {printAllGs1 &&
            printAllGs1.ssccBarcode.map((item: any, index: any) => (
              <GS1
                key={index}
                orderDetail={orderDetail}
                ssccBarcode={item}
                shipToPostBarcode={printAllGs1.shipToPostBarcode}
                forBarcode={printAllGs1.forBarcode}
              />
            ))}
          {barcodeData &&
            barcodeData.map((item, index) => (
              <Page key={index} size="A6" style={styles.page}>
                <View style={styles.container}>
                  <Image src={item} style={styles.barcodeImage} />
                </View>
              </Page>
            ))}
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ModalPrintAll;

const styles = StyleSheet.create({
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
    height: '100%'
  },
  barcodeImage: {
    marginBottom: 10
  }
});