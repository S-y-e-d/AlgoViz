export function RightPanel() {
    return (
        <div id="right-panel" className="panel">
            <div className="bar panel-bar" id="right-panel">Information</div>
            <div className="panel-content right-panel-content">
                {
                    `PseudoCode 
1.  low = 0
2.  high = n-1 
3   while low <= high:
4.      mid = (low + high)/2
5.  if array[mid] == target:
6.      return mid
7.  else if array[mid] < target:
8.      low = mid + 1
9.  else:
10.     high = mid-1`
                }


                <hr />

                {`Time Complexity: O(log(n))`}

                <hr />

                {`Binary search is a fast method to find a target in a sorted array. \
You repeatedly check the middle element of the current range: if it matches the target, \
you’re done; if the target is smaller, you search the left half, and if it's larger, \
you search the right half. This process continues until the target is found or the range is empty.`}

            </div>
        </div>
    )
}