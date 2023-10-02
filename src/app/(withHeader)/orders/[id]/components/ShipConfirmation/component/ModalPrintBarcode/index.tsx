/* eslint-disable jsx-a11y/alt-text */
import { BarCode } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import { Document, Image, PDFViewer, Page, View, StyleSheet, Text } from '@react-pdf/renderer';

const PrintModalBarcode = ({
  open,
  onClose,
  barcodeData
}: {
  open: boolean;
  onClose: () => void;
  barcodeData: BarCode[] | undefined;
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Barcode">
      {barcodeData && barcodeData.length > 0 && (
        <PDFViewer style={{ width: '100%', height: '500px' }}>
          <Document>
            {barcodeData.map((item) =>
              Array(item.quantity)
                .fill(item)
                .map((ele: BarCode, index) => (
                  <Page key={index} size="A6" style={styles.page}>
                    <View style={styles.container}>
                      <Image src={ele?.upc} style={styles.barcodeImage} />
                      <Text style={styles.textSku}>{ele?.sku}</Text>
                    </View>
                  </Page>
                ))
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
    color: 'black',
    padding: 0
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
