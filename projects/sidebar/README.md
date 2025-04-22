# ngx-smart-sidebar

A customizable, collapsible, responsive, feature-rich sidebar component for Angular apps.

![](https://badge.fury.io/js/ngx-smart-sidebar.svg)

![](https://img.shields.io/badge/License-MIT-yellow.svg)

[](https://via.placeholder.com/800x400?text=ngx-smart-sidebar+Preview)

## Features

- 🔄 Responsive design with collapsible functionality
- 📱 Multiple width options (small, medium, large)
- 🔄 Left or right positioning
- 🌈 Customizable styling and colors
- 📜 Multi-level navigation support
- 🔗 Full Angular Router integration
- 📱 Mobile-friendly with click-outside functionality
- 🔄 State persistence support via service

## Installation

```bash
npm install ngx-smart-sidebar --save

```

## Setup

1. Import the SidebarModule in your Angular module:

```tsx
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SidebarModule } from "@ngx-smart/sidebar";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SidebarModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

2.  Add the sidebar component to your template:

```html
<lib-sidebar [position]="'left'" [width]="'medium'" [title]="'My Sidebar'" [items]="sidebarItems" [activeItemPath]="activePath" [sidebarId]="'main-sidebar'" [collapsible]="true" [sidebarBackgroundColor]="'#f5f5f5'" [backgroundHighlightColor]="'#e0f7fa'" (sidebarItemSelected)="onItemSelected($event)">
  <div sidebarHeaderContent>Custom Header</div>
  <div sidebarFooterContent>Custom Footer</div>
</lib-sidebar>
```

### Example

**Basic Sidebar**

```tsx
import { Component } from "@angular/core";
import { SidebarComponent, SidebarSection } from "ngx-smart-sidebar";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <lib-sidebar [items]="sidebarItems" [title]="'Navigation'" [sidebarId]="'main-sidebar'"> </lib-sidebar>

    <div class="content">
      <!-- Your page content here -->
    </div>
  `,
})
export class AppComponent {
  activeItemPath = "/dashboard";

  sidebarItems: SidebarSection[] = [
    {
      header: "Main",
      labels: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Analytics", path: "/analytics" },
        {
          label: "User Management",
          children: [
            { label: "User List", path: "/users" },
            { label: "Add User", path: "/users/add" },
          ],
        },
      ],
    },
    {
      header: "Settings",
      labels: [
        { label: "Profile", path: "/profile" },
        { label: "Preferences", path: "/settings" },
      ],
    },
  ];
}
```

## API Reference

### Inputs

| Input                      | Type             | Default     | Description                                                                                    |
| -------------------------- | ---------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `position`                 | SidebarPosition  | `'left'`    | Position of the sidebar. Options are `'left'` or `'right'`.                                    |
| `width`                    | SidebarWidth     | `'medium'`  | Width of the sidebar. Options are `'small'` (150px), `'medium'` (250px), or `'large'` (300px). |
| `title`                    | string           | `''`        | Title displayed at the top of the sidebar.                                                     |
| `backgroundHighlightColor` | string           | `'#f5f7fa'` | Background color for highlighting when hovering over items.                                    |
| `items`                    | SidebarSection[] | `[]`        | Array of sidebar section objects defining the navigation structure.                            |
| `activeItemPath`           | string           | `''`        | Path of the currently active item, should match the router path.                               |
| `sidebarId`                | string           | `''`        | Unique identifier for the sidebar, useful when using multiple sidebars.                        |
| `collapsible`              | boolean          | `true`      | Whether the sidebar can be collapsed.                                                          |
| `hideSidebarOnPathChange`  | boolean          | `false`     | Whether to automatically collapse the sidebar when the route changes.                          |
| `closeOnClickOutside`      | boolean          | `false`     | Whether to close the sidebar when clicking outside of it.                                      |
| `sidebarBackgroundColor`   | string           | `'#ffffff'` | Background color of the sidebar.                                                               |

### Types

```tsx
export type SidebarPosition = "left" | "right";
export type SidebarWidth = "small" | "medium" | "large";

export interface SidebarLabel {
  label: string;
  path?: string;
  children?: SidebarLabel[];
  isExpanded?: boolean;
}

export interface SidebarSection {
  header: string;
  labels: SidebarLabel[];
}
```

## Custom Header and Footer Content

You can add custom content to the header and footer of the sidebar:

```html
<lib-sidebar [items]="sidebarItems">
  <div sidebarHeaderContent>
    <img src="assets/logo.png" alt="Logo" width="120" />
  </div>

  <div sidebarFooterContent>
    <p>© 2025 My App</p>
  </div>
</lib-sidebar>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## **Demo Application**

Create a demo app (`src/`) showcasing:

- Basic usage
- Nested menus
- Theming
- Responsive behavior

Add screenshots/GIFs to README.
