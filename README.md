[![CircleCI](https://circleci.com/gh/react-atomic/i13n.svg?style=svg)](https://circleci.com/gh/react-atomic/i13n)


A tiny I13N collecter
======

## Explain singleton issue
Because i13n is a base library, it possibile expends with others such as organism-react-i13n.

we need found a way to avoid two mutually exclusive instance.

Curreent solution was remove base singleton on index.js, and create another entry i13n-store 

## use base singleton store
```
import i13nStore from 'i13n-store'
```
