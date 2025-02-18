export const getNumberFromStringString = (string) => {
    let number = 0
    if(string.search('đồng/tháng')!==-1){
        number = +string.match(/\d+/)[0] / Math.pow(10,3)
    } else if (string.search('triệu/tháng')!==-1){
        number = +string.match(/\d+/)[0]
    } else if (string.search('m')) {
        number = +string.match(/\d+/)[0]
    }
    return number
}

export const getNumberFromString = (input) => {
    // Sử dụng biểu thức chính quy để tìm số trong chuỗi
    const match = input.match(/\d+/);
    // Nếu tìm thấy số, chuyển thành số nguyên, ngược lại trả về null
    return match ? parseInt(match[0], 10) : null;
}
