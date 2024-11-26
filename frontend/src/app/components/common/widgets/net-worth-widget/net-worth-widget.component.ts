import { Component } from '@angular/core';
import { NetWorth } from '../../../../models/net-worth';
import { AccountService } from '../../../../services/api/account-service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DatePipe, NgClass, NgIf } from '@angular/common';

export type ChartOptions = {
  chart: any;
  xaxis: any;
  stroke: any;
  dataLabels: any;
  yaxis: any;
  legend: any;
  plotOptions: any;
  grid: any;
};

@Component({
  selector: 'app-net-worth-widget',
  standalone: true,
  imports: [NgApexchartsModule, DatePipe, NgIf, NgClass],
  templateUrl: './net-worth-widget.component.html',
  styleUrl: './net-worth-widget.component.scss',
})
export class NetWorthWidgetComponent {
  protected readonly currentDate: Date = new Date();
  protected netWorth: NetWorth | undefined = undefined;

  // @ts-ignore
  public chartOptions: Partial<ChartOptions>;
  protected series: any = [];
  protected labels: string[] = [];

  constructor(private accountService: AccountService) {
    this.loadNetWorth();

    this.accountService.newAccount$.subscribe(() => {
      this.loadNetWorth();
    });
    this.accountService.updatedAccount$.subscribe(() => {
      this.loadNetWorth();
    });
  }

  private loadNetWorth() {
    this.accountService.getNetWorth().subscribe((netWorth) => {
      this.netWorth = netWorth;
      this.series = [
        {
          name: 'Net worth',
          data: netWorth.histories.map((history) => history.balance),
        },
      ];
      this.labels = netWorth.histories?.map((history) => history.date);
      this.initChartOptions();
    });
  }

  private initChartOptions() {
    this.chartOptions = {
      chart: {
        type: 'area',
        height: 160,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      grid: {
        borderColor: '#edf2fd',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MMM',
        },
        style: {
          fontFamily: 'Nunito Sans, sans-serif',
        },
        axisBorder: {
          show: true,
          color: '#edf2fd',
        },
      },
      yaxis: {
        opposite: true,
        style: {
          fontFamily: 'Nunito Sans, sans-serif',
        },
        labels: {
          formatter: (number: any) => {
            return number.toLocaleString('en-US', {
              maximumFractionDigits: 2,
              notation: 'compact',
              compactDisplay: 'short',
            });
          },
        },
      },
      legend: {
        horizontalAlign: 'left',
        fontFamily: 'Nunito Sans, sans-serif',
      },
      plotOptions: {
        area: {
          fillTo: 'origin',
        },
      },
    };
  }
}
