var array = [
    4,
    1,
    5,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
    3,
    4,
    0,
];
Object.defineProperty(array, "2", {
    get: function () {
        console.log("get 5");
        return 5;
    },
    set: function (v) {
        console.log("set 5");
    }
});
Object.defineProperty(array, "0", {
    get: function () {
        console.log("get 4");
        return 4;
    },
    set: function (v) {
        console.log("set 4");
    }
});
Object.defineProperty(array, "1", {
    get: function () {
        console.log("get 1");
        return 1;
    },
    set: function (v) {
        console.log("set 1");
    }
});
array.sort();
