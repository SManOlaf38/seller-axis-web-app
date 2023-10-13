/* eslint-disable jsx-a11y/alt-text */
import { useMemo } from 'react';
import { Document, Image, PDFViewer, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { Modal } from '@/components/ui/Modal';
import GS1 from '../ModalGS1/Gs1';
import PackingSlip from '../ModalPrintPackingSlip/PackingSlip';

import type { BarCode, Order } from '@/app/(withHeader)/orders/interface';

type ModalPrintAll = {
  open: boolean;
  onClose: () => void;
  orderDetail: Order;
  barcodeData: BarCode[] | undefined;
  printAllGs1:
    | {
        forBarcode: string;
        shipToPostBarcode: string;
        ssccBarcode: {
          tempSsccBarcode: string;
          sscc: string;
        }[];
      }
    | undefined;
  allLabel: string[];
};

const ModalPrintAll = ({
  open,
  onClose,
  orderDetail,
  barcodeData,
  printAllGs1,
  allLabel
}: ModalPrintAll) => {
  const dataPrintAll = useMemo(() => {
    return allLabel.map((item, index) => ({
      label: item,
      gs1: printAllGs1?.ssccBarcode[index],
      barcode: barcodeData && barcodeData[index]
    }));
  }, [allLabel, barcodeData, printAllGs1?.ssccBarcode]);

  return (
    <Modal title="Print all" open={open} onClose={onClose}>
      <PDFViewer style={styles.viewer}>
        <Document>
          <PackingSlip orderDetail={orderDetail} />
          {dataPrintAll.map((item, index) => (
            <>
              <Page size="A4" style={styles.page} key={index}>
                <Image style={styles.image} src={item.label} />
              </Page>
              <GS1
                orderDetail={orderDetail}
                ssccBarcode={item?.gs1?.tempSsccBarcode as string}
                sscc={item?.gs1?.sscc as string}
                shipToPostBarcode={printAllGs1?.shipToPostBarcode as string}
                forBarcode={printAllGs1?.forBarcode as string}
              />
              {Array(item.barcode?.quantity)
                .fill(item.barcode)
                .map((ele, index) => (
                  <Page key={index} size="A5" style={styles.page}>
                    <View style={styles.container}>
                      <Image src={ele?.upc} style={styles.barcodeImage} />
                      <Text style={styles.text}>{ele?.sku}</Text>
                    </View>
                  </Page>
                ))}
            </>
          ))}
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
