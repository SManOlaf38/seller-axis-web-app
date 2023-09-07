/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useEffect, useState } from 'react';
import { Document, Image as ImagePDF, PDFViewer, Page, StyleSheet } from '@react-pdf/renderer';

import { Modal } from '@/components/ui/Modal';
import { resetOrientation } from '@/constants';

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
          <ViewPackingSlip imagePrint={imagePrint} />
        </Document>
      </PDFViewer>
    </Modal>
  );
}

const ViewPackingSlip = ({ imagePrint }: { imagePrint: string }) => {
  const [imageData, setImageData] = useState<string>('');

  const generateNewBase64s = useCallback(async (data: string) => {
    const res = new Promise((res) => {
      resetOrientation(`data:image/gif;base64,${data}`, 6, function (resetBase64Image) {
        res(resetBase64Image);
      });
    });

    const temp = await res;
    setImageData(temp as string);
  }, []);

  const imageUrlToBase64 = (url: string, callback: (base64Data: any) => void) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader: any = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          callback(base64Data);
        };
      })
      .catch((error) => {
        console.error('Error converting image to base64:', error);
        callback(null);
      });
  };

  useEffect(() => {
    imageUrlToBase64(imagePrint, async function (base64Data) {
      if (base64Data) {
        generateNewBase64s(base64Data);
      }
    });
  }, [generateNewBase64s, imagePrint]);

  return (
    <Page size="A4" style={styles.page}>
      <ImagePDF style={styles.image} src={imageData} />
    </Page>
  );
};
