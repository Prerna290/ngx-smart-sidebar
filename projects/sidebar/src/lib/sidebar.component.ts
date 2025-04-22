import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from './sidebar.service';

export type SidebarPosition = 'left' | 'right';
export type SidebarWidth = 'small' | 'medium' | 'large';

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

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` <nav
    class="sidebar"
    [ngClass]="[
      position === 'left' ? 'left' : 'right',
      width === 'small' ? 'small' : width === 'medium' ? 'medium' : 'large',
      isCollapsed ? 'collapsed' : ''
    ]"
    [ngStyle]="{
      'background-color': sidebarBackgroundColor
        ? sidebarBackgroundColor
        : 'transparent'
    }"
  >
    <ng-content
      class="sidebar-content-wrapper"
      select="[sidebarHeaderContent]"
    ></ng-content>
    <header *ngIf="title || collapsible" class="sidebar-header">
      <h3 *ngIf="title">{{ title }}</h3>
      <button
        *ngIf="collapsible"
        class="toggle-btn"
        (click)="toggleSidebarState()"
      >
        {{ isCollapsed ? '☰' : '✕' }}
      </button>
    </header>

    <ul class="sidebar-menu" *ngIf="items?.length">
      <ng-container *ngFor="let item of items; let i = index">
        <div class="labels-list">
          <li class="section-header">
            {{ item.header }}
          </li>

          <li
            *ngFor="let label of item.labels; let j = index"
            class="menu-item"
            [class.active]="activeItemPath === label.path"
            [class.has-children]="label.children"
          >
            <a
              (click)="onItemClick(label, $event)"
              [routerLink]="label.path || null"
              [ngStyle]="{
                'background-color':
                  hoverItemIndex === i && hoverLabelIndex === j
                    ? backgroundHighlightColor
                    : 'transparent'
              }"
              (mouseenter)="hoverItemIndex = i; hoverLabelIndex = j"
              (mouseleave)="hoverItemIndex = null; hoverLabelIndex = null"
            >
              <span
                *ngIf="label.children?.length"
                class="caret"
                [class.rotated]="label.isExpanded !== false"
              >
                {{ label.isExpanded !== false ? '⌄' : '›' }}
              </span>
              <span>{{ label.label }}</span>
            </a>
            <ul
              *ngIf="label.children && label.isExpanded !== false"
              class="submenu"
              role="menu"
            >
              <li
                *ngFor="let child of label.children; let k = index"
                [class.active]="activeItemPath === child.path"
                class="submenu-item"
              >
                <a
                  [routerLink]="child.path"
                  (click)="sidebarItemSelected.emit(child)"
                  [ngStyle]="{
                    'background-color':
                      hoverItemIndex === i &&
                      hoverLabelIndex === j &&
                      hoverChildIndex === k
                        ? backgroundHighlightColor
                        : 'transparent'
                  }"
                  (mouseenter)="
                    hoverItemIndex = i; hoverLabelIndex = j; hoverChildIndex = k
                  "
                  (mouseleave)="hoverChildIndex = null"
                >
                  {{ child.label }}
                </a>
              </li>
            </ul>
          </li>
        </div>
      </ng-container>
    </ul>
    <ng-content
      class="sidebar-content-wrapper"
      select="[sidebarFooterContent]"
    ></ng-content>
  </nav>`,
  styles: `:host {
  display: block;
}

.sidebar {
  transition: width 0.3s ease, transform 0.3s ease;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  top: 0;
  background-color: #fff;
  z-index: 1000;
  padding: 30px 12px;
  word-break: break-word;

  &.collapsed {
    width: 40px !important;

    .sidebar-header {
      justify-content: center;
      padding: 12px 0;

      h3 {
        display: none;
      }
    }

    .sidebar-header h3,
    .menu-item span,
    .submenu,
    .caret,
    .section-header {
      display: none;
    }
  }

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }

  &.small {
    width: 150px;
  }

  &.medium {
    width: 250px;
  }

  &.large {
    width: 300px;
  }
}

.sidebar-content-wrapper {
  display: flex;
  align-items: center;
  padding: 16px 0;
  font-size: 14px;
  color: #132644;
  font-weight: 600;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;

  h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
    font-weight: 600;
  }

  .toggle-btn {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;
    display: block !important;
  }
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;

  .labels-list {
    margin-bottom: 20px;
  }

  .section-header {
    margin-bottom: 4px;
    font-size: 14px;
    color: #132644;
    font-weight: 700;
    text-transform: uppercase;
    display: flex;
    align-items: center;
  }

  .has-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .menu-item {
    &.active {
      a {
        color: #007bff;
        font-weight: 700;
      }
    }

    a {
      display: flex;
      align-items: center;
      padding: 10px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      color: #132644;
      transition: background-color 0.2s;

      .caret {
        margin-right: 10px;
        font-size: 12px;
        font-weight: 500;
        color: #757575;
        transition: transform 0.3s ease;

        span {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }

  .submenu {
    padding: 0;
    list-style: none;
    margin: 0 0 16px 16px;
    border-left: 2px solid #e0e0e0;

    .submenu-item {
      margin: 0px;

      &.active {
        a {
          color: #007bff;
          font-weight: 700;
        }
      }

      a {
        padding: 8px 0 8px 20px;
        display: block;
        color: #5e6e87;
        font-size: 12px;
        font-weight: 700;
        transition: all 0.3s ease;
      }
    }
  }
}
`,
})
export class SidebarComponent {
  @Input() position: SidebarPosition = 'left';
  @Input() width: SidebarWidth = 'medium';
  @Input() title: string = '';
  @Input() backgroundHighlightColor: string = '#e9ecef';
  @Input() items: SidebarSection[] = [];
  @Input() activeItemPath: string = '';
  @Input() sidebarId: string = '';
  @Input() collapsible: boolean = true;
  @Input() hideSidebarOnPathChange: boolean = false;
  @Input() closeOnClickOutside: boolean = false;
  @Input() sidebarBackgroundColor: string = '#ffffff';

  @Output() sidebarItemSelected = new EventEmitter<SidebarLabel>();
  @Output() toggleSidebar = new EventEmitter<boolean>();

  isCollapsed = false;
  hoverItemIndex: number | null = null; // corresponds to i
  hoverLabelIndex: number | null = null; // corresponds to j
  hoverChildIndex: number | null = null; // corresponds to k

  private stateSubscription?: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.sidebarService.setSidebarState(this.sidebarId, {
      isCollapsed: this.isCollapsed,
      position: this.position,
    });

    this.items?.forEach((section) => {
      section.labels?.forEach((label) => {
        if (label.children) {
          label.isExpanded = true;
        }
      });
    });

    this.stateSubscription = this.sidebarService
      .getSidebarState(this.sidebarId)
      .subscribe((state) => {
        this.isCollapsed = state.isCollapsed;
        this.position = state.position;
      });

    if (this.hideSidebarOnPathChange) {
      this.stateSubscription.add(
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.sidebarService.setSidebarState(this.sidebarId, {
              isCollapsed: true,
            });
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.closeOnClickOutside || this.isCollapsed) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.sidebarService.setSidebarState(this.sidebarId, {
        isCollapsed: true,
      });
    }
  }

  toggleSidebarState(): void {
    if (!this.collapsible) return;
    this.sidebarService.toggleSidebar(this.sidebarId);
    this.toggleSidebar.emit(this.isCollapsed);
  }

  onItemClick(item: SidebarLabel, event: Event): void {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
      event.preventDefault();
    } else if (item.path) {
      this.sidebarItemSelected.emit(item);
    }
  }
}
