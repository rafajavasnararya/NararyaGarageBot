export interface GroupMember{id:string;admin?:string|null}
export interface GroupInfo{id:string;subject:string;participants:GroupMember[]}
export interface GroupSettings{
  id:string;
  antilink:boolean;
  antispam:boolean;
  welcome:boolean;
  goodbye:boolean;
}
export type GroupAction="add"|"remove"|"promote"|"demote";
