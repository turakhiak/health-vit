import Dexie, { Table } from 'dexie';
import {
    MealEntry,
    ExerciseEntry,
    MetricEntry,
    FastingEntry,
    BeverageEntry,
    Component
} from './types';

export class KetoVitalDatabase extends Dexie {
    meals!: Table<MealEntry, string>;
    exercises!: Table<ExerciseEntry, string>;
    metrics!: Table<MetricEntry, string>;
    fasting!: Table<FastingEntry, string>;
    beverages!: Table<BeverageEntry, string>;
    components!: Table<Component, string>;

    constructor() {
        super('KetoVitalDB');
        this.version(1).stores({
            meals: 'id, ts, synced',
            exercises: 'id, ts, synced',
            metrics: 'id, ts, synced',
            fasting: 'id, ts, synced',
            beverages: 'id, ts, synced',
            components: 'id, category, isUserDefined' // Allow lookups by category
        });
    }
}

export const db = new KetoVitalDatabase();
