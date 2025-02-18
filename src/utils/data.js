import generateCode from "./generateCode"
const prices = [
    {
        min:0,
        max:1,
        value: "Dưới 1 triệu",
    },
    {
        min:1,
        max:2,
        value: "Từ 01 đến 02 triệu",
    },
    {
        min:2,
        max:3,
        value: "Từ 02 đến 03 triệu",
    },
    {
        min:3,
        max:5,
        value: "Từ 03 đến 05 triệu",
    },
    {
        min:5,
        max:7,
        value: "Từ 05 đến 07 triệu",
    },
    {
        min:7,
        max:10,
        value: "Từ 07 đến 10 triệu",
    },
    {
        min:10,
        max:15,
        value: "Từ 10 đến 15 triệu",
    },
    {
        min:15,
        max:999999,
        value: "Trên 15 triệu",
    },
]

const areas = [
    {
        min:0,
        max:20,
        value: 'Dưới 20m'
    },
    {
        min:20,
        max:30,
        value: 'Từ 20m đến 30m'
    },
    {
        min:30,
        max:50,
        value: 'Từ 30m đến 50m'
    },
    {
        min:50,
        max:70,
        value: 'Từ 50m đến 70m'
    },
    {
        min:70,
        max:90,
        value: 'Từ 70m đến 90m'
    },
    {
        min:90,
        max:999999,
        value: 'Trên 90m'
    }
]

export const dataPrice = prices.map(item => ({
    ...item,
    code: generateCode(item.value),
}))

export const dataArea = areas.map(item => ({
    ...item,
    code: generateCode(item.value),
}))




