// SessionInstanceGrid.js
import React from "react";
import {
  Datagrid,
  List,
  TextField,
  DateField,
  ReferenceField,
  TopToolbar,
  FunctionField,
} from "react-admin";

const NoActions = () => <TopToolbar />; // Empty toolbar component to replace default actions

export const SessionInstanceGrid = (props) => (
  <List {...props} actions={<NoActions />} pagination={null} perPage={10} sort={{ field: 'login_time', order: 'DESC' }} pollInterval={null}>
    <Datagrid>
      <TextField source="id" />
      <DateField
        source="login_time"
        showTime
        options={{
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }}
      />
      <DateField
        source="logout_time"
        showTime
        options={{
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }}
      />
      <FunctionField
        label="Duration (minutes)"
        render={(record) => {
          if (record.login_time && record.logout_time) {
            return `${parseFloat(record.duration).toFixed(2)} m`;
          }
          return "N/A";
        }}
      />
    </Datagrid>
  </List>
);
