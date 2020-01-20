export let navItems = [ ];

/* app.componentent is a check if user_role exist for the item , when excist  this  navitem part is added*/
export const time_navItems = [
  {
    title: true,
    name: 'Time management',
    badge: {
      variant: 'success',
      text: 'updated'
    }
  },
  {
    name: 'Time accounting',
    url: '/prikklok',
    icon: 'fa fa-lightbulb-o'

  }
];

export const time_navItemsAdmin= [
  {
    name: 'Projects',
    url: '/projects',
    icon: 'fa fa-product-hunt'
  },
  {
    name: 'Accounting',
    url: '/accounting',
    icon: 'fa fa-line-chart'
  }
];

export const time_navItemsroles = [
  {
    name: 'Reports',
    url: '/reports',
    icon: 'fa fa-file-excel-o'  
  }
];