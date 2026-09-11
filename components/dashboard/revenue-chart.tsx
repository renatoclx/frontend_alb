"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "@/types/dashboard";
import { formatMoney } from "@/utils/mask";

interface RevenueChartProps {
  data: RevenuePoint[];
}

function toDiaMes(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

const seriesLabel: Record<string, string> = {
  locacoes: "Locações",
  vendas: "Vendas",
};

// Eixo Y compacto ("3,8 mil") pra não espremer o gráfico no mobile — o valor
// cheio aparece no tooltip.
function toEixoY(value: number): string {
  return value.toLocaleString("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
}

export function RevenueChart({ data }: RevenueChartProps) {
  const semMovimento = data.every((point) => point.total === 0);

  if (semMovimento) {
    return (
      <p className="py-16 text-center text-sm text-foreground/50">
        Sem receita registrada nos últimos 30 dias.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="data"
            tickFormatter={toDiaMes}
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={(value: number) => toEixoY(value)}
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            formatter={(value, name) => [
              formatMoney(Number(value)),
              seriesLabel[String(name)] ?? String(name),
            ]}
            labelFormatter={(label) => toDiaMes(String(label))}
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="locacoes"
            stackId="receita"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.15}
          />
          <Area
            type="monotone"
            dataKey="vendas"
            stackId="receita"
            stroke="var(--color-info)"
            fill="var(--color-info)"
            fillOpacity={0.15}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
