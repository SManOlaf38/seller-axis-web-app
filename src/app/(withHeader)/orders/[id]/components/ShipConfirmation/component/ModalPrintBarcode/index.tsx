/* eslint-disable jsx-a11y/alt-text */
import { Modal } from '@/components/ui/Modal';
import { Document, Image, PDFViewer, Page, View } from '@react-pdf/renderer';

const PrintModalBarcode = ({
  open,
  onClose,
  barcodeData
}: {
  open: boolean;
  onClose: () => void;
  barcodeData: string[];
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Barcode">
      {barcodeData.length > 0 && (
        <PDFViewer style={{ width: '100%', height: 417 }}>
          <Document>
            <Page
              size="A6"
              style={{
                backgroundColor: '#ffffff',
                color: 'black'
              }}
            >
              <View
                style={{
                  height: 417
                }}
              >
                {barcodeData.map((item, index) => (
                  <Image key={index} src={item} />
                ))}
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </Modal>
  );
};

export default PrintModalBarcode;
