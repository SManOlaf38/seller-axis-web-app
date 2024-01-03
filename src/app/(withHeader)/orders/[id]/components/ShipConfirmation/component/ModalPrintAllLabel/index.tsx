/* eslint-disable jsx-a11y/alt-text */
import { Document, PDFViewer, Page, Image, StyleSheet } from '@react-pdf/renderer';

import { Modal } from '@/components/ui/Modal';
import type { Label } from '@/app/(withHeader)/orders/interface';

const ModalPrintAllLabel = ({
  open,
  onClose,
  allLabel
}: {
  open: boolean;
  onClose: () => void;
  allLabel: Label[];
}) => {
  return (
    <Modal title="All Label" open={open} onClose={onClose}>
      <PDFViewer
        style={{
          width: '100%',
          height: 500
        }}
      >
        <Document>
          {allLabel.map((item: { data: string }) => (
            <Page key={item?.data} size="A4" style={styles.page}>
              <Image style={styles.image} src={item?.data} />
            </Page>
          ))}
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ModalPrintAllLabel;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%'
  },
  page: {
    backgroundColor: '#ffffff',
    color: 'white',
    width: '100%',
    height: 417
  },
  section: {
    margin: 10,
    padding: 10
  },
  viewer: {
    width: '100%',
    height: 417
  }
});
