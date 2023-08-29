import { Document, PDFViewer } from '@react-pdf/renderer';

import { Order } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import GS1 from '../ModalGS1/Gs1';

const ModalAllGs1 = ({
  open,
  onClose,
  orderDetail,
  printAllGs1
}: {
  open: boolean;
  onClose: () => void;
  orderDetail: Order;
  printAllGs1:
    | {
        forBarcode: string;
        shipToPostBarcode: string;
        ssccBarcode: string[];
      }
    | undefined;
}) => {
  return (
    <Modal title="All GS1" open={open} onClose={onClose}>
      <PDFViewer
        style={{
          width: '100%',
          height: 700
        }}
      >
        <Document>
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
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ModalAllGs1;
