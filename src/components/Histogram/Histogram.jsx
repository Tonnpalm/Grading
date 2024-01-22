// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const amount = [
//   {name: 'A', point: 64},
//   {name: 'B', point: 66},
//   {name: 'C', point: 56},
//   {name: 'D', point: 77},
//   {name: 'E', point: 66},
//   {name: 'F', point: 96},
//   {name: 'G', point: 85},
//   {name: 'H', point: 87},
//   {name: 'I', point: 68},
//   {name: 'J', point: 86},
// ];


const data = [];

for (let i = 1; i <= 100; i++) {
  data.push({ x: i, จำนวนนักเรียน: Math.random() * 100});
}

function testChart() {
  return (
    <div className="App">
    <h1>Example chart</h1>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" label={{ value: 'คะแนน 1-100', position: 'insideBottom', offset: -10 }} />
        <YAxis label={{ value: 'จำนวนนักเรียน', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="จำนวนนักเรียน" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}

export default testChart;