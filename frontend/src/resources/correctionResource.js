import React from 'react';
import { List, Datagrid, TextField, DateField, Show, SimpleShowLayout, useRecordContext, Pagination } from 'react-admin';

// Custom field for displaying proposed corrections in the list view
const CorrectionsListField = (props) => {
    const record = useRecordContext(props);
    if (!record || !record.proposed_corrections) {
        return null;
    }
    return (
        <ul>
            {record.proposed_corrections.map((correction, index) => (
                <li key={index}>
                    Image ID: {correction.image}, Target ClassType: {correction.target_classType}, Affected Segments: {correction.affected_segments.length}
                </li>
            ))}
        </ul>
    );
};
CorrectionsListField.defaultProps = { label: 'Proposed Corrections' };

// Custom field for displaying detailed proposed corrections in the show view
const CorrectionsShowField = (props) => {
    const record = useRecordContext(props);
    if (!record || !record.proposed_corrections) {
        return null;
    }
    return (
        <ul>
            {record.proposed_corrections.map((correction, index) => (
                <li key={index}>
                    <p>ID: {correction.id}</p>
                    <p>Image ID: {correction.image}</p>
                    <p>Status: {correction.status}</p>
                    <p>Target ClassType: {correction.target_classType}</p>
                    <p>Affected Segments: {correction.affected_segments.join(', ')}</p>
                </li>
            ))}
        </ul>
    );
};
CorrectionsShowField.defaultProps = { label: 'Proposed Corrections' };

// List Component for Corrections
export const CorrectionList = props => (
    <List {...props} title="Corrections" perPage={10} sort={{ field: 'submission_datetime', order: 'DESC' }} pagination={<Pagination />} pollInterval={null}>
        <Datagrid rowClick={(id) => `/admin/corrections/${id}/show`}>
        {/* <Datagrid rowClick="show"> */}
            <TextField source="id" />
            <TextField source="checked_by" />
            <DateField source="submission_datetime" showTime />
            <DateField source="check_date" />
            <CorrectionsListField source="proposed_corrections" />
            <TextField source="status" />
        </Datagrid>
    </List>
);

// Show Component for Corrections
export const CorrectionShow = props => (
    <Show {...props} title="Correction Details">
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="checked_by" />
            <DateField source="submission_datetime" showTime />
            <DateField source="check_date" />
            <CorrectionsShowField source="proposed_corrections" />
            <TextField source="status" />
        </SimpleShowLayout>
    </Show>
);
