import { Injectable } from '@angular/core';
import { SchuetzeStammdatenDTO } from '../types/inside/schuetze-stammdaten-dto';

@Injectable({
  providedIn: 'root'
})
export class ShooterOrderService {

  private getStorageKey(teamId: number, wettkampfId: number): string {
    return `shooter-order-${wettkampfId}-${teamId}`;
  }

  saveShooterOrder(teamId: number, wettkampfId: number, shooterIds: number[]): void {
    const key = this.getStorageKey(teamId, wettkampfId);
    localStorage.setItem(key, JSON.stringify(shooterIds));
  }

  loadShooterOrder(teamId: number, wettkampfId: number): number[] | null {
    const key = this.getStorageKey(teamId, wettkampfId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  applyShooterOrder(shooters: SchuetzeStammdatenDTO[], teamId: number, wettkampfId: number): SchuetzeStammdatenDTO[] {
    const savedOrder = this.loadShooterOrder(teamId, wettkampfId);
    if (!savedOrder || savedOrder.length !== shooters.length) {
      return shooters;
    }

    const ordered: SchuetzeStammdatenDTO[] = [];
    const shooterMap = new Map(shooters.map(s => [s.schuetzenId, s]));

    for (const id of savedOrder) {
      const shooter = shooterMap.get(id);
      if (shooter) {
        ordered.push(shooter);
        shooterMap.delete(id);
      }
    }

    ordered.push(...Array.from(shooterMap.values()));
    return ordered;
  }

  reorderShooters(shooters: SchuetzeStammdatenDTO[], fromIndex: number, toIndex: number): SchuetzeStammdatenDTO[] {
    const result = [...shooters];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }
}