/* eslint-disable jsx-a11y/alt-text */
import { Modal } from '@/components/ui/Modal';
import { Document, Image, PDFViewer, Page, View, StyleSheet } from '@react-pdf/renderer';

const PrintModalBarcode = ({
  open,
  onClose,
  barcodeData
}: {
  open: boolean;
  onClose: () => void;
  barcodeData: string[] | undefined;
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Barcode">
      {barcodeData && barcodeData.length > 0 && (
        <PDFViewer style={{ width: '100%', height: '500px' }}>
          <Document>
            {barcodeData.map((item, index) => (
              <Page key={index} size="A6" style={styles.page}>
                <View style={styles.container}>
                  <Image src={item} style={styles.barcodeImage} />
                </View>
              </Page>
            ))}
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
    color: 'black',
    padding: 0
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
