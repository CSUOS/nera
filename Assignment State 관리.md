# Assignment State 관리

## 사용법

1. 사용할 js 파일에서 `shared`폴더의 `AssignmentState.js`를 import 한다.
2. hook의 useContext를 이용해 context를 정의한다.
3. 정의한 context를 dictionary로 사용한다.

dictionary는 `AssignmentState.js`에서 다음과 같이 정의되어있다.

```js
{"notReleased":0,"released":1,"scoring":2,"done":3}
```



## 의미

* notReleased (0) : 교수님은 과제를 냈지만, 발행 전이라 학생들은 볼 수 없는 상태
* released (1) : 과제가 발행되고 학생들이 풀고 있는 상태
* scoring (2) : 과제의 deadline이 지나 학생들이 더이상 과제를 풀 수 없고, 교수님이 채점해야하는 상태
* done (3) : 교수님이 채점을 완료하여 학생이 결과를 볼 수 있는 상태



<우선순위>

> 교수의 입장에서는 2 >> 1 > 0 >> 3
>
> 학생의 입장에서는 1 > 3 >> 2 > 0



## 사용 예제

```js
import {useAssignmentState} from '../shared/AssignmentState';

// 함수 내에서
const asState = useAssignmnetState();

// 상태를 사용할 곳에서
const state = asState["notReleased"];
```



## 사용 기술

React의 createContext로 context를 만들고,

React hook의 useContext를 써서 변수를 사용하였다.