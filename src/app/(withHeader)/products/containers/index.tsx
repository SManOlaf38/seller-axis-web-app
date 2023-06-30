'use client';
import { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';

import ClassificationContext from '../context/context';
import ClassificationReducer, { initialState } from '../context/reducer';

import { SubBar } from '@/components/common/SubBar';
import { LAYOUTS } from '@/constants';
import useLayout from '@/hooks/useLayout';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { GridView } from '../components/gridView';
import { ListView } from '../components/listView';
import { action } from '../context';
import { IGetPayload } from '../context/type';
import {
  addClassifications,
  deleteActionClassification,
  deleteClassification,
  getClassifications,
  getDetailClassification,
  updateClassifications
} from '../fetch';

export default function ProductContainer() {
  const [state, dispatch] = useReducer(ClassificationReducer, initialState);
  const { dataClassification, classification_detail, error, loading } = state;

  const { layout, handleChangeLayout } = useLayout();
  const { page, onPageChange } = usePagination();
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataClassification.results
  });
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState<string | number>('');

  const onSubmitClassification = async (data: any) => {
    if (isEdit) {
      try {
        dispatch(action.updateClassificationRequest());
        await updateClassifications({ id, data });
        onHandleGetClassification({
          search: debouncedSearchTerm,
          currentPage: page
        });
        setOpenModal(!openModal);
        reset();
        dispatch(action.updateClassificationSuccess());
      } catch (error) {
        dispatch(action.updateClassificationFailure('Can not update classification'));
      }
    } else {
      try {
        dispatch(action.addClassificationRequest());
        await addClassifications(data);
        onHandleGetClassification({ search, currentPage: page });
        dispatch(action.addClassificationSuccess());
        setOpenModal(!openModal);
        reset();
      } catch (err: any) {
        dispatch(action.addClassificationFailure('Can not add classification'));
      }
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
    // resolver: yupResolver(ClassificationSchema)
  });

  const onHandleModal = () => {
    setOpenModal(!openModal);
    setIsEdit(false);
  };

  const onEditItem = async (value: string | number) => {
    setIsEdit(!isEdit);
    try {
      dispatch(action.getClassificationDetailRequest());
      const dataNew = await getDetailClassification(value);
      setOpenModal(!openModal);
      dispatch(action.getClassificationDetailSuccess(dataNew));
    } catch (error) {
      dispatch(action.getClassificationDetailFailure('Can not get classification'));
    }
    setId(value);
  };

  const onDeleteItem = async (id: number) => {
    try {
      await deleteClassification({ id });
      onHandleGetClassification({ search, currentPage: page });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onSelectAction = async () => {
    try {
      await deleteActionClassification({ id: selectedItems });
      onHandleGetClassification({ search, currentPage: page });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onHandleGetClassification = async ({ search, currentPage }: IGetPayload) => {
    try {
      dispatch(action.getClassificationRequest());
      const dataNew = await getClassifications({ search, currentPage });
      dispatch(action.getClassificationSuccess(dataNew));
    } catch (error) {
      dispatch(action.getClassificationFailure(''));
    }
  };

  useEffect(() => {
    onHandleGetClassification({ search, currentPage: page });
  }, [page, search]);

  return (
    <ClassificationContext.Provider value={{ state, dispatch }}>
      <div className="flex h-full flex-col">
        <div className="flex h-full flex-col gap-[18px]">
          <SubBar
            search={search}
            typeLayout={layout}
            onChangeLayout={handleChangeLayout}
            title={'Classification'}
            addTitle={`${isEdit ? 'Edit' : 'Add'} Classification`}
            onSearch={handleSearch}
            onSubmit={onHandleModal}
            onSearchModal={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
          <div className="h-full">
            {layout === LAYOUTS.LIST ? (
              <ListView
                selectedItems={selectedItems}
                onSelectAction={onSelectAction}
                onSelectAll={onSelectAll}
                onSelectItem={onSelectItem}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
                totalCount={dataClassification?.count}
                currentPage={page}
                onPageChange={onPageChange}
              />
            ) : (
              <GridView
                totalCount={dataClassification?.count}
                currentPage={page}
                onPageChange={onPageChange}
                selectedItems={selectedItems}
                onSelectAction={onSelectAction}
                onSelectAll={onSelectAll}
                onSelectItem={onSelectItem}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
              />
            )}
          </div>
        </div>
      </div>
    </ClassificationContext.Provider>
  );
}
