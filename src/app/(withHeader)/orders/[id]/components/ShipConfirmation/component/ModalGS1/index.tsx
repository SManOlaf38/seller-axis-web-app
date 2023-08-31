/* eslint-disable jsx-a11y/alt-text */
import { Order } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import { Document, PDFViewer } from '@react-pdf/renderer';
import GS1 from './Gs1';

const PrintModalGS1 = ({
  open,
  onClose,
  orderDetail,
  ssccBarcode,
  shipToPostBarcode,
  forBarcode
}: {
  open: boolean;
  onClose: () => void;
  orderDetail: Order;
  ssccBarcode: string;
  shipToPostBarcode: string;
  forBarcode: string;
}) => {
  return (
    <Modal title="GS1" open={open} onClose={onClose}>
      <PDFViewer
        style={{
          width: '100%',
          height: 500
        }}
      >
        <Document>
          <GS1
            orderDetail={orderDetail}
            ssccBarcode={ssccBarcode}
            shipToPostBarcode={shipToPostBarcode}
            forBarcode={forBarcode}
          />
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default PrintModalGS1;
