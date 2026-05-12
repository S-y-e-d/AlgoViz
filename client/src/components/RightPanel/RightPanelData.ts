import type { StructureType } from "../../App";

export type AlgoInfo = {
    name: string;
    pseudocode: string;
    time: string;
    space?: string;
    description: string;
};

export type AlgoMap = {
    [structure in StructureType]: {
        [algo: string]: AlgoInfo;
    };
};

export const algoInfoMap: AlgoMap = {
    array: {
        insertion: {
            name: "Array Insertion",
            pseudocode: `1. for i = n down to index:
2.   arr[i] = arr[i-1]
3. arr[index] = value`,
            time: "O(n)",
            space: "O(1)",
            description:
                "Insertion in an array requires shifting elements to make space at the desired index. This makes it linear in the worst case.",
        },

        deletion: {
            name: "Array Deletion",
            pseudocode: `1. for i = index to n-2:
2.   arr[i] = arr[i+1]
3. reduce size by 1`,
            time: "O(n)",
            space: "O(1)",
            description:
                "Deleting an element requires shifting all subsequent elements left to fill the gap.",
        },

        linearSearch: {
            name: "Linear Search",
            pseudocode: `1. for i = 0 to n-1:
2.   if arr[i] == target:
3.     return i
4. return -1`,
            time: "O(n)",
            space: "O(1)",
            description:
                "Linear search checks each element sequentially until the target is found or the array ends.",
        },

        binarySearch: {
            name: "Binary Search",
            pseudocode: `1. low = 0, high = n-1
2. while low <= high:
3.   mid = (low + high) / 2
4.   if arr[mid] == target:
5.     return mid
6.   else if arr[mid] < target:
7.     low = mid + 1
8.   else:
9.     high = mid - 1`,
            time: "O(log n)",
            space: "O(1)",
            description:
                "Binary search repeatedly halves the search space in a sorted array, making it very efficient.",
        },

        bubbleSort: {
            name: "Bubble Sort",
            pseudocode: `1. for i = 0 to n-1:
2.   for j = 0 to n-i-2:
3.     if arr[j] > arr[j+1]:
4.       swap(arr[j], arr[j+1])`,
            time: "O(n^2)",
            space: "O(1)",
            description:
                "Bubble sort repeatedly swaps adjacent elements if they are in the wrong order.",
        },

        selectionSort: {
            name: "Selection Sort",
            pseudocode: `1. for i = 0 to n-1:
2.   min = i
3.   for j = i+1 to n-1:
4.     if arr[j] < arr[min]:
5.       min = j
6.   swap(arr[i], arr[min])`,
            time: "O(n^2)",
            space: "O(1)",
            description:
                "Selection sort repeatedly selects the minimum element and places it at the correct position.",
        },

        insertionSort: {
            name: "Insertion Sort",
            pseudocode: `1. for i = 1 to n-1:
2.   key = arr[i]
3.   j = i-1
4.   while j >= 0 and arr[j] > key:
5.     arr[j+1] = arr[j]
6.     j--
7.   arr[j+1] = key`,
            time: "O(n^2)",
            space: "O(1)",
            description:
                "Insertion sort builds a sorted portion one element at a time by inserting elements into their correct position.",
        },

        mergeSort: {
            name: "Merge Sort",
            pseudocode: `1. if n <= 1: return
2. split array into two halves
3. recursively sort both halves
4. merge the sorted halves`,
            time: "O(n log n)",
            space: "O(n)",
            description:
                "Merge sort uses divide-and-conquer to split the array and merge sorted halves efficiently.",
        },
    },

    list: {
        insertion: {
            name: "Linked List Insertion",
            pseudocode: `1. create new node with value
2. if inserting at head:
3.   newNode.next = head
4.   head = newNode
5. else:
6.   traverse to (index - 1)
7.   newNode.next = current.next
8.   current.next = newNode`,
            time: "O(n)",
            space: "O(1)",
            description:
                "Insertion in a linked list involves updating pointers. Unlike arrays, elements do not need to be shifted, but traversal to the insertion point may be required.",
        },

        deletion: {
            name: "Linked List Deletion",
            pseudocode: `1. if deleting head:
2.   head = head.next
3. else:
4.   traverse to (index - 1)
5.   current.next = current.next.next`,
            time: "O(n)",
            space: "O(1)",
            description:
                "Deletion in a linked list is done by updating pointers to skip the target node. Traversal is needed to reach the node before the one being deleted.",
        },
    },
    tree: {
        inorder: {
            name: "Inorder Traversal",
            pseudocode: `1. traverse(left)
2. visit(node)
3. traverse(right)`,
            time: "O(n)",
            space: "O(h)",
            description:
                "Inorder traversal visits nodes in left-root-right order. In a binary search tree, this results in sorted order.",
        },

        preorder: {
            name: "Preorder Traversal",
            pseudocode: `1. visit(node)
2. traverse(left)
3. traverse(right)`,
            time: "O(n)",
            space: "O(h)",
            description:
                "Preorder traversal visits nodes in root-left-right order. It is useful for copying or reconstructing trees.",
        },

        postorder: {
            name: "Postorder Traversal",
            pseudocode: `1. traverse(left)
2. traverse(right)
3. visit(node)`,
            time: "O(n)",
            space: "O(h)",
            description:
                "Postorder traversal visits nodes in left-right-root order. It is commonly used for deleting or evaluating trees.",
        },
    }
};