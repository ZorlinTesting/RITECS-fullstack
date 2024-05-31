import React from 'react';
import { List, Datagrid, TextField, EmailField, EditButton, DeleteButton, Pagination } from 'react-admin';
import { Create, SimpleForm, TextInput, Edit, BooleanInput, ReferenceManyField } from 'react-admin';
import { Show, SimpleShowLayout } from 'react-admin';
import { SessionInstanceGrid } from './sessionGrid';

export const UserList = props => (
    <List {...props} title="Users" perPage={10} sort={{ field: 'id', order: 'DESC' }} pagination={<Pagination />} pollInterval={null}>
        <Datagrid rowClick={(id) => `/admin/users/${id}/show`}>
            <TextField source="id" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <TextField source="phone_number" />
            <TextField source="is_active" />
            <EditButton basePath="/users" />
            <DeleteButton basePath="/users" />
        </Datagrid>
    </List>
);

export const UserCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="username" />
            <TextInput source="email" />
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="phone_number" />
            <BooleanInput source="is_active" />
        </SimpleForm>
    </Create>
);

export const UserEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="username" />
            <EmailField source="email" />
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="phone_number" />
            <BooleanInput source="is_active" />
        </SimpleForm>
    </Edit>
);

// export const UserShow = props => (
//     <Show {...props}>
//         <SimpleShowLayout>
//             <TextField source="id" />
//             <TextField source="username" />
//             <EmailField source="email" />
//             <TextField source="first_name" />
//             <TextField source="last_name" />
//             <TextField source="phone_number" />
//             <TextField source="is_active" />
//         </SimpleShowLayout>
//     </Show>
// );

export const UserShow = props => (
    <Show {...props} title="User Details">
        <SimpleShowLayout>
            <TextField source="username" />
            <TextField source="email" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <TextField source="phone_number" />
            <TextField source="is_active" />

            <ReferenceManyField reference="sessions" target="user_id" label="Sessions">
                <SessionInstanceGrid />
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);
