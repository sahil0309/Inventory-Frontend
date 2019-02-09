import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'TableFilter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      for (var prop in val) {
        // skip loop if the property is from prototype
        if(!val.hasOwnProperty(prop)) continue;
        // your code
        // console.log('val[prop]: ' + val[prop]);

        if(val[prop]){
          if(val[prop].toString().toLocaleLowerCase().includes(args)){
            return val[prop];
          }
        }
      }
    })
  }
}

// import { Pipe, PipeTransform } from '@angular/core';
//
// @Pipe({
//   name: 'filter'
// })
//
// export class FilterPipe implements PipeTransform {
//   transform(items: any[], searchText: string): any[] {
//     if(!items) return [];
//     if(!searchText) return items;
//       searchText = searchText.toLowerCase();
//       console.log('searchText: ' + searchText);
//     return items.filter( it => {
//       console.log(it);
//       return it.toString().toLowerCase().includes(searchText);
//     });
//    }
// }
