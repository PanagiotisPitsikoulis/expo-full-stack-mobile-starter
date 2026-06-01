import { Chart, Text } from "../..";

export function Basic() {
  return (
    <Chart.Container config={{ desktop: { color: "#2563eb", label: "Desktop" } }}>
      <Text className="text-sm font-medium text-foreground">Chart preview</Text>
      <Chart.LegendContent payload={[{ color: "#2563eb", dataKey: "desktop", value: "Desktop" }]} />
      <Chart.Tooltip>
        <Chart.TooltipContent
          label="Visitors"
          payload={[{ color: "#2563eb", name: "Desktop", value: 186 }]}
        />
      </Chart.Tooltip>
    </Chart.Container>
  );
}

export { Basic as AreaChart, Basic as BarChart, Basic as LineChart };
