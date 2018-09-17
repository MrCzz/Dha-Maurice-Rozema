import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings.component';
import { RouteDetail } from '../../route/route-detail/route-detail.component';
import { TrainingDetailPage } from '../../training-scheme/training-detail/training-detail.component'

@Component({
  templateUrl: 'tabs.component.html'
})
export class TabsPage {

  tab1Root = RouteDetail;
  tab2Root = TrainingDetailPage
  tab3Root = SettingsPage;

  constructor() {
  }
  
}
