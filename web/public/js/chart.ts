export interface ChartPoint{label:string;value:number}
export function total(points:ChartPoint[]):number{
  return points.reduce((sum,point)=>sum+point.value,0);
}
export function max(points:ChartPoint[]):ChartPoint|undefined{
  return points.reduce((best,current)=>!best||current.value>best.value?current:best,undefined as ChartPoint|undefined);
}
export function labels(points:ChartPoint[]):string[]{
  return points.map(point=>point.label);
}