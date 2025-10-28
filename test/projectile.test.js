import { createProjectile } from '../js/projectile.js';

describe('Projectile Module', () => {
    test('should create a projectile with a size property', () => {
        const projectile = createProjectile(0, 0, 10, 10);
        expect(projectile).toHaveProperty('size');
        expect(projectile.size).toBe(3);
    });
});
