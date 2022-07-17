import React, { PureComponent } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from "recharts";

const data = [
	{
		name: "April",
		uv: 2780,
		pv: 3908,
		amt: 2000
	},
	{
		name: "May",
		uv: 1890,
		pv: 4800,
		amt: 2181
	},
	{
		name: "June",
		uv: 2390,
		pv: 3800,
		amt: 2500
	},
	{
		name: "July",
		uv: 349,
		pv: 430,
		amt: 210
	}
];

export default class Example extends PureComponent {
	render() {
		return (
			// <ResponsiveContainer width="100%" height="100">
			<AreaChart
				width={700}
				height={400}
				data={data}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="uv"
					stackId="1"
					stroke="#8884d8"
					fill="#8884d8"
				/>
				<Area
					type="monotone"
					dataKey="pv"
					stackId="1"
					stroke="#82ca9d"
					fill="#82ca9d"
				/>
				<Area
					type="monotone"
					dataKey="amt"
					stackId="1"
					stroke="#ffc658"
					fill="#ffc658"
				/>
			</AreaChart>
			// </ResponsiveContainer>
		);
	}
}
