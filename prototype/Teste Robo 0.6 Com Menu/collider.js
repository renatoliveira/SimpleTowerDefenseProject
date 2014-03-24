// colider .js
function Collider(x1, y1, x2, y2)
{
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;

	/*
	x1,y1______
		|      |
		| col  |
		|______|
		        x2,y2
	*/

	this.isColliding = function(otherCollider) // checa se estamos colidindo com o outro objeto
	{
		if (this.x1 >= otherCollider.x1 && this.x1 <= otherCollider.x2 &&
			this.y1 >= otherCollider.y1 && this.y1 <= otherCollider.y2)
		{
			return true;
		}
		else return false;
		//droidContext.strokeRect(this.x + 20, this.y + 20, this.x + 46, this.y + 46);
	}
}