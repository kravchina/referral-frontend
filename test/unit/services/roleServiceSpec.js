describe("Testing Role Service", function() {
    var Role;
    var USER_ROLES = {
        admin: {id: 'admin', name: 'Administrator', mask: 1},
        doctor: {id: 'doctor', name: 'Dental Services Provider', mask: 2},
        aux: {id: 'aux', name: 'Auxiliary', mask: 4},
        super: {id: 'super', name: 'God of DentalLinks', mask: 8},
        public: {id: 'public', name: 'Public Access', mask: 16}
    };

    beforeEach(function(){
        module('dentalLinksServices');

        module(function($provide) {
            $provide.value('USER_ROLES', USER_ROLES);
        });

        inject(function($injector, _Role_) {
            Role = _Role_;
        });
    });

    it('should have Role service be defined', function () {
        expect(Role).toBeDefined();
    });

    it('check getAllRoles function', function () {
        expect(Role.getAllRoles()).toEqual([USER_ROLES.admin, USER_ROLES.doctor, USER_ROLES.aux]);
    });

    it('check getFromMask function', function () {
        expect(Role.getFromMask(USER_ROLES.admin.mask)).toEqual([USER_ROLES.admin]);
        expect(Role.getFromMask(USER_ROLES.doctor.mask)).toEqual([USER_ROLES.doctor]);
        expect(Role.getFromMask(USER_ROLES.aux.mask)).toEqual([USER_ROLES.aux]);
        expect(Role.getFromMask(USER_ROLES.super.mask)).toEqual([USER_ROLES.super]);
        expect(Role.getFromMask(USER_ROLES.public.mask)).toEqual([USER_ROLES.public]);

        expect(Role.getFromMask(USER_ROLES.admin.mask + USER_ROLES.doctor.mask ))
            .toEqual([USER_ROLES.admin, USER_ROLES.doctor]);
    });

    it('check convertRolesToMask function', function () {
        //check when parameter is array of objects
        expect(Role.convertRolesToMask([USER_ROLES.admin, USER_ROLES.doctor]))
            .toEqual(USER_ROLES.admin.mask + USER_ROLES.doctor.mask);
        //check when parameter is array of strings
        expect(Role.convertRolesToMask([USER_ROLES.admin.id, USER_ROLES.doctor.id]))
            .toEqual(USER_ROLES.admin.mask + USER_ROLES.doctor.mask);
    });

    it('check getRolesByNames function', function () {
        expect(Role.getRolesByNames([USER_ROLES.admin.id, USER_ROLES.doctor.id, USER_ROLES.super.id]))
            .toEqual([USER_ROLES.admin, USER_ROLES.doctor, USER_ROLES.super]);
    });

    it('check hasRoles function', function () {
        expect(Role.hasRoles([USER_ROLES.doctor],[USER_ROLES.doctor, USER_ROLES.admin]))
            .toBe(true);
        expect(Role.hasRoles([USER_ROLES.aux],[USER_ROLES.doctor, USER_ROLES.admin]))
            .toBe(false);
    });

});
