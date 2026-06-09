import { LineChart, Line, ResponsiveContainer } from 'recharts'

export function MiniSparkline({
  data,
  color = '#2A6BDB',
  height = 32,
}: {
  data: number[]
  color?: string
  height?: number
}) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
