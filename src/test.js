const Sum = arr => {
    let sum = 0;
    for (let i = 0;i < arr.length;i++) {
        sum += arr[i];
    }
    return sum;
}

let arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(Sum(arr1));

const Unique = arr => {
    for (let i = 0;i < arr.length - 1;i++) {
        for(let j = i + 1;j< arr.length; j++) {
            if(arr[i] === arr[j]) {
                arr.splice(j, 1);
            }
        }
    }
    return arr;
}

const arr2 = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

console.log(Unique(arr2));

const Transform = str => {
    for (let i = 0;i < str.length;i++) {
        if(str[i].charCodeAt() < 97 || str[i].charCodeAt() > 122) {
            str = str.replace(str[i],"");
        }
    }
    return str.toUpperCase();
}

const str = 'h,e,l,l,o?w,o,r,d'

console.log(Transform(str));