import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [
      {
        success: true,
        message: 'user baru berhasil dibuat',
        id: 1,
        name: 'budi',
      },
      {
        success: true,
        message: 'user baru berhasil dibuat',
        id: 2,
        name: 'joko',
      },
    ];
  }

  findOne(id: number) {
    return {
      success: true,
      message: 'user berhasil ditemukan',
      data: [
        {
          id,
          name: 'joko',
        },  
      ],
    };
  }
}
