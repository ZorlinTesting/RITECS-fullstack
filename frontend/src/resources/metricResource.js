// metricResource.js
import React from 'react';
import { List, Datagrid, TextField, DateField, Show, SimpleShowLayout, useRecordContext, Pagination  } from 'react-admin';


// Custom Fields
const SumsField = (props) => {
    const record = useRecordContext(props);
    if (!record || !record.sums || record.sums.length === 0) {
        return <div>No Data</div>;
    }
    return (
        <ul>
            {record.sums.map((sum, index) => (
                <li key={index}>
                    {Object.keys(sum)[0]}: {Object.values(sum)[0]}
                </li>
            ))}
        </ul>
    );
};
SumsField.defaultProps = { label: 'Sub-stats' };

const DetailedSumsField = (props) => {
    const record = useRecordContext(props);
    if (!record || !record.sums || record.sums.length === 0) {
        return <div>No Data</div>;
    }
    const detailedSums = {
        TP: 'True Positives',
        FP: 'False Positives',
        FN: 'False Negatives',
        CM: 'Class Mismatches'
    };
    return (
        <ul>
            {record.sums.map((sum, index) => (
                <li key={index}>
                    {detailedSums[Object.keys(sum)[0]]}: {Object.values(sum)[0]}
                </li>
            ))}
        </ul>
    );
};
DetailedSumsField.defaultProps = { label: 'Detailed Sub-stats' };

const NumberFieldWithFormat = ({ source }) => {
    const record = useRecordContext();
    if (!record || !record[source]) {
        return null;
    }
    return <span>{record[source].toFixed(4)}</span>;
};

NumberFieldWithFormat.defaultProps = { label: 'Number' };


// Helper function to format numbers to four decimal places
const formatNumber = (value) => value.toFixed(4);

// Metric List
export const MetricList = (props) => (
    <List {...props} title="Metrics" perPage={10} sort={{ field: 'timestamp', order: 'DESC' }} pagination={<Pagination />} pollInterval={null}>
        <Datagrid rowClick={(id) => `/admin/metrics/${id}/show`}>
            <TextField source="id" />
            <DateField source="timestamp" label="Timestamp" showTime/>
            <NumberFieldWithFormat source="accuracy" label="Accuracy" render={record => formatNumber(record.accuracy)} />
            <NumberFieldWithFormat source="precision" label="Precision" render={record => formatNumber(record.precision)} />
            <NumberFieldWithFormat source="recall" label="Recall" render={record => formatNumber(record.recall)} />
            <NumberFieldWithFormat source="f1_score" label="F1 Score" render={record => formatNumber(record.f1_score)} />
            <SumsField source="sums"/>
        </Datagrid>
    </List>
);

// Metric Show
export const MetricShow = (props) => (
    <Show {...props} title="Metric Data Point">
        <SimpleShowLayout>
            <TextField source="id" />
            <DateField source="timestamp" label="Timestamp" showTime/>
            <NumberFieldWithFormat source="accuracy" label="Accuracy" />
            <NumberFieldWithFormat source="precision" label="Precision" />
            <NumberFieldWithFormat source="recall" label="Recall" />
            <NumberFieldWithFormat source="f1_score" label="F1 Score" />
            <DetailedSumsField source="sums"/>
        </SimpleShowLayout>
    </Show>
);
