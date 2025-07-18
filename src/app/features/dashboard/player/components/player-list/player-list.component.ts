import { Component } from '@angular/core';
import { User, UserPlayer } from '../../../../../core/interfaces/user';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../../../../shared/components/loading/loading.component";
import { PagedResponse } from '../../../../../core/interfaces/paged-response';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent {
  user!: UserPlayer;
  players!: PagedResponse<UserPlayer>;
  loading: boolean = false;

  currentPage: number = 0;
  pageSize: number = 8;

  constructor(
    private playerService: PlayerService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.getPlayers(this.currentPage);
  }

  getPlayers(page: number): void {
    this.loading = true;

    this.playerService.getPlayers(page, this.pageSize).subscribe({
      next: (data) => {
        this.loading = false;
        this.players = data;
        this.currentPage = data.number;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: err.error.message || 'Error al cargar la lista de jugadores',
          timer: 2000,
        });
      },
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.players.totalPages) {
      this.getPlayers(newPage);
    }
  }

  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http')
      ? user.imageUrl
      : '/assets/profile_icon.webp';
  }
}
