<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Pest\Mutate\Mutators\Concerns\HasName;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function customers()
    {
        return $this->hasMany(Customer::class, 'user_id');
    }
    public function purchases()
    {
        return $this->hasMany(ConiPurchase::class, 'created_by');
    }

    public function clients(){
        return $this->hasOne(UserInformation::class,'user_id');
    }

    public function coniPurchases()
    {
        return $this->hasMany(ConiPurchase::class, 'created_by');
    }
    public function distributers(){
        return $this->hasOne(Distrubutrer::class,'user_id');
    }
    public function information()
    {
        return $this->hasOne(UserInformation::class, 'user_id');
    }

    public function employees()
    {
        return $this->hasOne(Employee::class, 'user_id');
    }
   
}
