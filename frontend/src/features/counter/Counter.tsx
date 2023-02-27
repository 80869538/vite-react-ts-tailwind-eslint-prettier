import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

const Counter = () => {
  const count: number = useSelector((state: any) => state.counter.count);
  const dispatch = useDispatch();
  return(
    <section className="">
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>
    </section>
  ) 
};


export default Counter;
