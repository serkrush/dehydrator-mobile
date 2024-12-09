export const percentage = (start, finish, step) => {
    let res = []

    let i = start
    while(i <= finish) {
        res.push({ label: `${i} %`, value: i})
        i = i + step
    }

    return res
};
