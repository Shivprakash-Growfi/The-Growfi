import TableContainer from 'components/Common/TableContainer';
import { changeBnplInvoiceStatus } from 'helpers/backend_helper';
import React, { useMemo, useState } from 'react';
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';

const AmountInputModal = ({
  isOpenModal,
  handleModalClose,
  modalHeader,
  selectedData,
}) => {
  const [fetchedData, setFetchedData] = useState(selectedData);
  const handleInvoiceOnChange = (e, data) => {
    const updatedData = fetchedData.map(item =>
      item.requestOrderId === data
        ? { ...item, invoiceId: e.target.value }
        : item
    );
    setFetchedData(updatedData);
  };
  const handleAmountOnChange = (e, data) => {
    const updatedData = fetchedData.map(item =>
      item.requestOrderId === data ? { ...item, amount: e.target.value } : item
    );
    setFetchedData(updatedData);
  };

  console.log(fetchedData);

  const handleSaveClick = () => {
    changeBnplInvoiceStatus(fetchedData)
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Order ID',
        accessor: 'requestOrderId',
        width: '25%',
        canSort: true,
      },
      {
        Header: 'Invoice ID',
        accessor: 'invoiceId',
        width: '25%',
        Cell: ({ row }) => (
          <input
            type="text"
            onChange={e =>
              handleInvoiceOnChange(e, row.original.requestOrderId)
            }
            value={row.original.invoiceId}
          />
        ),
      },
      {
        Header: 'Amount1',
        accessor: 'amount',
        Cell: ({ row }) => (
          <Input
            type="text"
            onChange={e => handleAmountOnChange(e, row.original.requestOrderId)}
            value={row.original.amount}
          />
        ),
      },
    ],
    [fetchedData]
  );

  return (
    <>
      <Modal isOpen={isOpenModal}>
        <ModalHeader tag="h4">
          {modalHeader}
          <button
            type="button"
            onClick={() => handleModalClose()}
            className="close font-size-14 m-2"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          {/* {selectedData.map((val, key) => {
            return (
              <div className="d-flex" key={key}>
                <Row className="mb-2">
                  <Col>
                    <Label>{val.requestOrderId}</Label>
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      value={val.amount}
                      onChange={() => console.log(val.amount)}
                    ></Input>
                  </Col>
                </Row>
              </div>
            );
          })} */}
          <TableContainer
            columns={columns}
            data={fetchedData}
            isGlobalFilter={false}
            hideShowButton={true}
            customPageSize={10}
            showFilterByCol={true}
          />
        </ModalBody>
        <ModalFooter>
          <Button type="button" onClick={() => handleSaveClick()}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AmountInputModal;
