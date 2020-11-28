const removeElement = (nums: Array<number>, val: number) => {
  for (const i in nums) {
    while (nums[+i] == val) {
      nums.splice(+i, 1)
    }
  }
}

let nums = [3, 3, 2, 2, 3]
removeElement(nums, 3)
nums //?
