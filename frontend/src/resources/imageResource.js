import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  DateField,
  Show,
  SimpleShowLayout,
  ReferenceField,
  ArrayField,
  SingleFieldList,
  ChipField,
  FunctionField,
  Pagination
} from "react-admin";
import LazyLoad from 'react-lazyload';


export const ImageList = (props) => (
  <List {...props} perPage={10} sort={{ field: 'uploaded_at', order: 'DESC' }} pagination={<Pagination />} pollInterval={null}>
    <Datagrid rowClick={(id) => `/admin/images/${id}/show`}>
      <TextField source="id" />
      {/* enable when demo-ing */}
      <FunctionField
        label="Image"
        render={(record) => (
          <LazyLoad height={200} offset={100} once>
            <img src={record.image_url} alt={record.title} style={{ width: '50%', height: 'auto' }} />
          </LazyLoad>
        )}
      />
      <DateField source="uploaded_at" />
      <FunctionField
        label="Machine Name"
        render={(record) => `${record.machine.name}`}
      />
      <FunctionField
        label="Segmentation Data"
        render={record => {
            const maxLength = 25;  // Set the maximum length of the string
            const truncatedText = record.segmentation.segmentation_data.slice(0, maxLength);
            return `${truncatedText}${record.segmentation.segmentation_data.length > maxLength ? '...' : ''}`;
        }}
      />
    </Datagrid>
  </List>
);

export const ImageShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="image_ref" />
      <ImageField source="image_url" title="title" />
      <TextField source="title" />
      <TextField source="description" />
      <DateField source="uploaded_at" />
      <TextField source="segmentation" />
      <TextField source="metadata" />
      <ArrayField source="image_checks">
        <Datagrid>
          <TextField source="check_type" />
          <TextField source="result" />
        </Datagrid>
      </ArrayField>
      <ReferenceField source="machine" reference="machines">
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);
