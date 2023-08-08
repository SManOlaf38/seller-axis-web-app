/* eslint-disable jsx-a11y/alt-text */
import { Modal } from '@/components/ui/Modal';
import { Document, PDFViewer, Page, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  image: {
    paddingTop: '10%',
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

type ModalPrint = {
  open: boolean;
  imagePrint: string;
  handleCloseModal: () => void;
};

export default function ModalPrintLabel({ imagePrint, open, handleCloseModal }: ModalPrint) {
  return (
    <Modal
      width="w-[800px]"
      open={open}
      title={'The Printing Value returned From UPS'}
      onClose={handleCloseModal}
    >
      <PDFViewer style={styles.viewer}>
        <Document>
          <Page size="A6" style={styles.page}>
            <Image style={styles.image} src={imagePrint} />
          </Page>
        </Document>
      </PDFViewer>
    </Modal>
  );
}
