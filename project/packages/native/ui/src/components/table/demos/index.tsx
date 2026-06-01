import { View } from "react-native";

import { Table, Text } from "../..";

const invoices = [
  { amount: "$2,500.00", customer: "Acme Co.", status: "Paid" },
  { amount: "$1,200.00", customer: "Pitsi Studio", status: "Pending" },
  { amount: "$820.00", customer: "Northwind", status: "Overdue" },
];

export function Basic() {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Column>Customer</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Amount</Table.Column>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {invoices.map((invoice) => (
              <Table.Row key={invoice.customer}>
                <Table.Cell>{invoice.customer}</Table.Cell>
                <Table.Cell>{invoice.status}</Table.Cell>
                <Table.Cell>{invoice.amount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export function SecondaryVariant() {
  return (
    <Table variant="secondary">
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Column>Metric</Table.Column>
              <Table.Column>Value</Table.Column>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>128</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Queued</Table.Cell>
              <Table.Cell>14</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export function EmptyState() {
  return (
    <Table>
      <Table.Content>
        <Table.Body
          items={[]}
          renderEmptyState={<Text className="p-4 text-muted">No rows.</Text>}
        />
      </Table.Content>
    </Table>
  );
}

export function CustomCells() {
  return (
    <Table>
      <Table.Content>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <View className="gap-1">
                <Text className="text-sm font-medium text-foreground">Workout</Text>
                <Text className="text-xs text-muted">Strength session</Text>
              </View>
            </Table.Cell>
            <Table.Cell>Completed</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

export {
  Basic as AsyncLoading,
  Basic as ColumnResizing,
  Basic as ExpandableRows,
  Basic as Pagination,
  Basic as Selection,
  Basic as Sorting,
  Basic as TanstackTable,
  Basic as Virtualization,
};
