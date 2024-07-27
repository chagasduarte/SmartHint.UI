import { Cliente } from "./cliente";

export class ClientePage {
    items: Cliente[];
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalCount: number;

    public constructor(items: Cliente[], pageNumber: number, pageSize: number, count: number)
    {
        this.currentPage = pageNumber;
        this.totalPage = 
        this.pageSize = pageSize;
        this.totalCount = count;

        this.items = items;
    }
}